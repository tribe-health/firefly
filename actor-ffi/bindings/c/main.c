#include "include/wallet.h"
#include <stdio.h>
#include <string.h>
#include <unistd.h>

void callback(const char *message) {
  printf(message);
  fflush(stdout);
}

int main() {
  send_message("C message", callback);
  sleep(4); // dumb way to wait for the callback to run
  return 0;
}
