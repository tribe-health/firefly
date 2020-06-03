
ifeq ($(shell uname),Darwin)
    LDFLAGS := -Wl
	LD_LIBRARY_PATH := target/debug/libwallet.dylib
else
    LDFLAGS := -Wl,--gc-sections -lpthread -ldl
	LD_LIBRARY_PATH := target/debug/libwallet.so
endif

all: target/wallet
	target/wallet

target:
	mkdir -p $@

target/wallet: target/main.o $(LD_LIBRARY_PATH)
	$(CC) -o $@ $^ $(LDFLAGS)

$(LD_LIBRARY_PATH): src/lib.rs Cargo.toml
	cargo build

target/main.o: main.c include/wallet.h | target
	$(CC) -o $@ -c $<

clean:
	rm -rf target