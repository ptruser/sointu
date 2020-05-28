#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <string>
#include <thread>
#include <memory>

#pragma pack(push,1)
extern "C" {
    struct Unit {
        float state[8];
        float ports[8];
    };

    struct Voice {
        int note;
        int release;
        float inputs[8];
        float reserved[6];
        struct Unit units[63];
    };

    struct Synth {
        unsigned char curvoices[32];
        float left;
        float right;
        float aux[6];
        struct Voice voices[32];

    };

    struct DelayWorkspace {
        float buffer[65536];
        float dcin;
        float dcout;
        float filtstate;
    };

    struct SynthState {
        struct Synth synth;
        struct DelayWorkspace delaywrks[64]; // let's keep this as 64 for now, so the delays take 16 meg. If that's too little or too much, we can change this in future.
        unsigned char commands[32 * 64];
        unsigned char values[32 * 64 * 8];
        unsigned int polyphony;
        unsigned int numvoices;
        unsigned int randseed;
        unsigned int globaltime;
        unsigned int rowtick;
    };
}
#pragma pack(pop)

static const struct Voice EmptyVoice;
static const struct SynthState EmptySynthState;

enum Command {
    RENDER,
    TRIGGER,
    RELEASE,
    SET_COMMANDS,
    SET_VALUES,
    SET_POLYPHONY,
    SET_NUMVOICES,
    RESET
};

#if UINTPTR_MAX == 0xffffffff // are we 32-bit?
#if defined(__clang__) || defined(__GNUC__)
#define CALLCONV __attribute__ ((stdcall))
#elif defined(_WIN32)
#define CALLCONV __stdcall // on 32-bit platforms, we just use stdcall, as all know it
#endif
#else // 64-bit
#define CALLCONV  // the asm will use honor honor correct x64 ABI on all 64-bit platforms
#endif

#ifdef INCLUDE_GMDLS
extern "C" void CALLCONV su_load_gmdls(void);
#endif

extern "C" void CALLCONV su_tick(SynthState* synthState);

namespace beast = boost::beast;         // from <boost/beast.hpp>
namespace http = beast::http;           // from <boost/beast/http.hpp>
namespace websocket = beast::websocket; // from <boost/beast/websocket.hpp>
namespace net = boost::asio;            // from <boost/asio.hpp>
using tcp = boost::asio::ip::tcp;       // from <boost/asio/ip/tcp.hpp>

//------------------------------------------------------------------------------

// Echoes back all received WebSocket messages
void
do_session(tcp::socket& socket)
{
    const int MAX_SAMPLES = 65536;

    try
    {
        std::unique_ptr<SynthState> synthState(new SynthState);
        synthState->randseed = 1;
        synthState->numvoices = 1;

        // Construct the stream by moving in the socket
        websocket::stream<tcp::socket> ws{ std::move(socket) };

        // Set a decorator to change the Server of the handshake
        ws.set_option(websocket::stream_base::decorator(
            [](websocket::response_type& res)
            {
                res.set(http::field::server,
                    std::string(BOOST_BEAST_VERSION_STRING) +
                    " websocket-server-sync");
            }));

        // Accept the websocket handshake
        ws.accept();

        ws.binary(true);

        float samplebuf[MAX_SAMPLES * 2];

        for (;;)
        {


            // This buffer will hold the incoming message
            beast::flat_buffer flatbuf;
            
            char recBuf[32 * 64 * 8+1]; // enough to hold the whole values if needed

            // Read a message
            ws.read(flatbuf);
            // TODO: boost::asio::buffer_copy(boost::asio::buffer(recBuf), flatbuf);

            int voiceno, note, i, samples;

            switch (recBuf[0]) {
            case RENDER:
                samples = *reinterpret_cast<int*>(&recBuf[1]);
                if (samples > MAX_SAMPLES)
                    samples = MAX_SAMPLES;
                if (samples < 0)
                    samples = 0;
                i = 0;
                while (samples--) {
                    synthState->synth.left = 0.0f;
                    synthState->synth.right = 0.0f;
                    su_tick(synthState.get());
                    samplebuf[i++] = synthState->synth.left;
                    samplebuf[i++] = synthState->synth.right;
                }
                ws.write(boost::asio::buffer(samplebuf, i*sizeof(float)));
                break;
            case TRIGGER:
                voiceno = (int)recBuf[1];
                voiceno = std::min(std::max(voiceno, 0), 31);
                note = (int)recBuf[2];
                synthState->synth.voices[voiceno] = EmptyVoice;
                synthState->synth.voices[voiceno].note = note;
                break;
            case RELEASE:
                voiceno = (int)recBuf[1];
                voiceno = std::min(std::max(voiceno, 0), 31);
                synthState->synth.voices[voiceno].release++;
                break;
            case SET_COMMANDS:
                //boost::asio::buffer_copy(boost::asio::buffer(tempchar, bytes_transferred),
               //     buffer_.data(), bytes_transferred);
                break;
            case SET_VALUES:
                break;
            case SET_POLYPHONY:
                synthState->polyphony = *reinterpret_cast<int*>(&recBuf[1]);
                break;
            case SET_NUMVOICES:
                synthState->numvoices = std::min(std::max(*reinterpret_cast<int*>(&recBuf[1]), 1), 32);
                break;
            case RESET:
                *synthState = EmptySynthState;
                break;
            }

        }
    }
    catch (beast::system_error const& se)
    {
        // This indicates that the session was closed
        if (se.code() != websocket::error::closed)
            std::cerr << "Error: " << se.code().message() << std::endl;
        else
            std::cout << "Connection closed" << std::endl;
    }
    catch (std::exception const& e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}

//------------------------------------------------------------------------------

int main(int argc, char* argv[])
{
    try
    {
        #ifdef INCLUDE_GMDLS
            su_load_gmdls();
        #endif

        auto const address = net::ip::make_address(argv[1]);
        auto const port = static_cast<unsigned short>(std::atoi(argv[2]));

        // open the gui using https://stackoverflow.com/questions/17347950/how-do-i-open-a-url-from-c

        // The io_context is required for all I/O
        net::io_context ioc{ 1 };


        // The acceptor receives incoming connections
        tcp::acceptor acceptor{ ioc, tcp::endpoint(tcp::v4(), 0) };
        for (;;)
        {
            // This will receive the new connection
            tcp::socket socket{ ioc };

            // Block until we get a connection
            acceptor.accept(socket);

            std::cout << "New connection" << std::endl;

            // Launch the session, transferring ownership of the socket
            std::thread{ std::bind(
                &do_session,
                std::move(socket)) }.detach();
        }
    }
    catch (const std::exception& e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
        return EXIT_FAILURE;
    }
}