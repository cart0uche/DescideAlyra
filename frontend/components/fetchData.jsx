import { publicClient } from "../conf/client";
import { parseAbiItem } from "viem";

export async function fetchResearcher(setter) {
   console.log("--------> fetchResearcher");
   const blockNumber = BigInt(
      Number(await publicClient.getBlockNumber()) - 15000
   );
   const filter = await publicClient.createEventFilter({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: parseAbiItem(
         "event ResearcherAdded(address, string, string, string)"
      ),
      fromBlock: blockNumber < 0 ? 0n : blockNumber,
   });

   const logs = await publicClient.getFilterLogs({ filter });

   const parsedResearchers = logs.map((log, index) => {
      const address = log.args[0];
      const lastname = log.args[1];
      const forname = log.args[2];
      const company = log.args[3];
      return {
         address,
         lastname,
         forname,
         company,
      };
   });
   setter(parsedResearchers);
}

export async function fetchProject(setter) {
   console.log("--------> fetchProject");
   const blockNumber = BigInt(
      Number(await publicClient.getBlockNumber()) - 15000
   );
   const filter = await publicClient.createEventFilter({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: parseAbiItem("event ResearchProjectCreated(uint256, address)"),
      fromBlock: blockNumber < 0 ? 0n : blockNumber,
   });

   const logs = await publicClient.getFilterLogs({ filter });

   const parsedProjects = logs.map((log, index) => {
      const projectId = log.args[0];
      const researcherAddress = log.args[1];
      return {
         projectId,
         researcherAddress,
      };
   });
   setter(parsedProjects);
}
