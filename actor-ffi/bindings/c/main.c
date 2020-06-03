#include "include/wallet.h"
#include <stdio.h>
#include <string.h>

void callback(const char *message) {
  printf(message);
  fflush(stdout);
}

int main() {
  send_message("C message", callback);
  return 0;
}