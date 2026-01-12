# Quickstart

> Get started with Inco Lightning in minutes

## Prerequisites

Before you begin, make sure you have:

* [Bun](https://bun.sh//) installed (you can also chose to use node + npm or equivalent)
* [Docker](https://www.docker.com/get-started) installed
* [Foundry](https://book.getfoundry.sh/) installed
* Basic knowledge of Solidity and JavaScript/TypeScript

## 1-minute setup

We recommend getting started using our [template](https://github.com/Inco-fhevm/lightning-rod).

1. Clone the repository:

   ```sh
   git clone git@github.com:Inco-fhevm/lightning-rod.git
   cd lightning-rod
   ```

   Note that you can also clone the repository using HTTPS:

   ```
   git clone https://github.com/Inco-fhevm/lightning-rod
   cd lightning-rod
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Compile contracts and test:

   ```sh
   bun run test
   ```

4. Finally, stop the docker containers which were started for the test:

   ```sh
   docker compose down
   ```

See [README.md](https://github.com/Inco-fhevm/lightning-rod) for other options on how to run the local development environment.

## Next Steps

If you are using Inco for the first time we recommend following our guide of basics, or you can learn from example.

<CardGroup cols="2">
  <Card title="Concepts Guide" icon="book-open" href="/guide">
    Learn the basics of Inco Lightning
  </Card>

  <Card title="Library Reference" icon="file-contract" href="/quickstart/lib-reference">
    Learn how to write confidential smart contracts
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.inco.org/llms.txt
