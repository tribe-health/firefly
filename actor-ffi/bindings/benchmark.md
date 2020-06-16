Benchmark results running `hyperfine`.

`$ hyperfine --min-runs=100 --export-markdown benchmark.md 'java -jar ./java/target/wallet.jar' 'cd c && ./target/wallet' './rust-app/target/release/rust' 'node ./node/benchmark.js' 'node ./node-neon/benchmark.js'`

| Command                              |      Mean [s] | Min [s] | Max [s] |    Relative |
| :----------------------------------- | ------------: | ------: | ------: | ----------: |
| `java -jar ./java/target/wallet.jar` | 4.217 ± 0.191 |   3.733 |   4.612 | 1.59 ± 0.11 |
| `cd c && ./target/wallet`            | 2.656 ± 0.141 |   2.294 |   2.957 |        1.00 |
| `./rust-app/target/release/rust`     | 2.735 ± 0.267 |   1.986 |   3.271 | 1.03 ± 0.11 |
| `node ./node/benchmark.js`           | 7.729 ± 0.112 |   7.483 |   8.144 | 2.91 ± 0.16 |
| `node ./node-neon/benchmark.js`      | 2.993 ± 0.184 |   2.701 |   3.474 | 1.13 ± 0.09 |

| Command                              |      Mean [s] | Min [s] | Max [s] |    Relative |
| :----------------------------------- | ------------: | ------: | ------: | ----------: |
| `java -jar ./java/target/wallet.jar` | 4.264 ± 0.189 |   3.698 |   4.995 | 1.70 ± 0.17 |
| `cd c && ./target/wallet`            | 2.508 ± 0.223 |   1.838 |   3.157 |        1.00 |
| `./rust-app/target/release/rust`     | 2.570 ± 0.394 |   1.661 |   3.231 | 1.02 ± 0.18 |
| `node ./node/benchmark.js`           | 7.608 ± 0.121 |   7.453 |   8.248 | 3.03 ± 0.27 |
| `node ./node-neon/benchmark.js`      | 2.981 ± 0.199 |   2.646 |   3.514 | 1.19 ± 0.13 |
