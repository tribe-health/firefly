typedef void (*Callback)(const char *response);
extern void *send_message(const char *message, Callback callback);
