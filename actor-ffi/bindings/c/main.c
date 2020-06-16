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
  int i;
  for (i = 0; i < 100000; i++) {
    send_message("message from C", callback);
  }
  return 0;
}
