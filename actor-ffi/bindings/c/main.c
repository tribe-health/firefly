#include "include/wallet.h"
#include <stdio.h>
#include <string.h>
#include <unistd.h>

void callback(const char *message) {
  printf("C response message received: %s\n", message);
  fflush(stdout);
}

int main() {
  init();
  send_message("message from C", callback);
  send_message("second message from C", callback);
  return 0;
}
