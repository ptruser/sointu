//
// Copyright (c) 2016-2019 Vinnie Falco (vinnie dot falco at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//
// Official repository: https://github.com/boostorg/beast
//

//------------------------------------------------------------------------------
//
// Example: WebSocket server, synchronous
//
//------------------------------------------------------------------------------

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
    try
    {
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

        for (;;)
        {
            // This buffer will hold the incoming message
            beast::flat_buffer buffer;

            // Read a message
            ws.read(buffer);

            // Echo the message back
            ws.text(ws.got_text());
            ws.write(buffer.data());
        }
    }
    catch (beast::system_error const& se)
    {
        // This indicates that the session was closed
        if (se.code() != websocket::error::closed)
            std::cerr << "Error: " << se.code().message() << std::endl;
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
        std::unique_ptr<SynthState> synthState(new SynthState);
        std::cout << "size is: " << sizeof(SynthState);
        synthState->randseed = 1;
        synthState->numvoices = 1;
        su_tick(synthState.get());

        // Check command line arguments.
        if (argc != 3)
        {
            std::cerr <<
                "Usage: websocket-server-sync <address> <port>\n" <<
                "Example:\n" <<
                "    websocket-server-sync 0.0.0.0 8080\n";
            return EXIT_FAILURE;
        }

        #ifdef INCLUDE_GMDLS
            su_load_gmdls();
        #endif

        auto const address = net::ip::make_address(argv[1]);
        auto const port = static_cast<unsigned short>(std::atoi(argv[2]));

        // The io_context is required for all I/O
        net::io_context ioc{ 1 };

        // The acceptor receives incoming connections
        tcp::acceptor acceptor{ ioc, {address, port} };
        for (;;)
        {
            // This will receive the new connection
            tcp::socket socket{ ioc };

            // Block until we get a connection
            acceptor.accept(socket);

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