import { publicClient } from "../conf/client";
import { parseAbiItem } from "viem";

const fromBlock = 3950400n; //0n;

export async function fetchResearcher(setter) {
   console.log("fetchResearcher");
   const blockNumber = BigInt(
      Number(await publicClient.getBlockNumber()) - 15000
   );
   const filter = await publicClient.createEventFilter({
      address: process.env.NEXT_PUBLIC_CONTRACT_RESEARCHER_ADDRESS,
      event: parseAbiItem(
         "event ResearcherAdded(address, string, string, string)"
      ),
      //fromBlock: blockNumber < 0 ? 0n : blockNumber,
      fromBlock: fromBlock,
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
   console.log("fetchProject");
   const blockNumber = BigInt(
      Number(await publicClient.getBlockNumber()) - 15000
   );
   const filter = await publicClient.createEventFilter({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: parseAbiItem("event ResearchProjectCreated(uint256, address)"),
      //fromBlock: blockNumber < 0 ? 0n : blockNumber,
      fromBlock: fromBlock,
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

export async function fetchFundsRequests(setter, projectId) {
   const blockNumber = BigInt(
      Number(await publicClient.getBlockNumber()) - 15000
   );
   const filter = await publicClient.createEventFilter({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: parseAbiItem(
         "event FundsRequestCreated(uint256, uint256, address)"
      ),
      fromBlock: fromBlock,
   });

   const logs = await publicClient.getFilterLogs({ filter });
   console.log("logs", logs);

   // add a filter on projectId
   const filteredLogs = logs.filter((log) => {
      return log.args[0] === projectId;
   });

   const parsedProjects = filteredLogs.map((log, index) => {
      const fundsProjectId = log.args[0];
      const fundsRequestId = log.args[1];
      const researcherAddress = log.args[2];
      return {
         fundsProjectId,
         fundsRequestId,
         researcherAddress,
      };
   });

   setter(parsedProjects);
}

export async function fetchVotes(setter, projectId) {
   const blockNumber = BigInt(
      Number(await publicClient.getBlockNumber()) - 15000
   );
   const filter = await publicClient.createEventFilter({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: parseAbiItem("event VoteAdded(address, uint, uint, bool)"),
      fromBlock: fromBlock,
   });

   const logs = await publicClient.getFilterLogs({ filter });
   console.log("logs", logs);

   // add a filter on projectId
   const filteredLogs = logs.filter((log) => {
      return log.args[1] === projectId;
   });

   const parsedVotes = filteredLogs.map((log, index) => {
      const voter = log.args[0];
      const projectId = log.args[1];
      const fundsRequestId = log.args[2];
      const voted = log.args[3];
      return {
         voter,
         projectId,
         fundsRequestId,
         voted,
      };
   });

   setter(parsedVotes);
}

// event NFTbought(address investor, uint projectId, uint typeNFT, uint timestamp);
export async function fetchInvestedProjects(setter, investorAddress) {
   const blockNumber = BigInt(
      Number(await publicClient.getBlockNumber()) - 15000
   );
   const filter = await publicClient.createEventFilter({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: parseAbiItem("event NFTbought(address, uint, uint, uint)"),
      fromBlock: fromBlock,
   });

   const logs = await publicClient.getFilterLogs({ filter });
   console.log("logs", logs);

   // add a filter on projectId
   const filteredLogs = logs.filter((log) => {
      return log.args[0] === investorAddress;
   });

   const parsedInvests = filteredLogs.map((log, index) => {
      const projectId = log.args[1];
      const typeNFT = log.args[2];
      const timestamp = log.args[3];
      return {
         projectId,
         typeNFT,
         timestamp,
      };
   });

   setter(parsedInvests);
}