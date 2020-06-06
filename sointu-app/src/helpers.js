export default function mod (n, m) { // ensures only positive values
  return ((n % m) + m) % m
}
