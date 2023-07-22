import Link from "next/link";
import { Text } from "@chakra-ui/react";

function SeeVoteDetails() {
   return (
      <div>
         {" "}
         <Link href="/vote">
            <Text fontSize="xl">See Vote details</Text>
         </Link>
      </div>
   );
}

export default SeeVoteDetails;
