import {
   Step,
   StepDescription,
   StepIcon,
   StepIndicator,
   StepNumber,
   StepSeparator,
   StepStatus,
   StepTitle,
   Stepper,
   useSteps,
   Box,
   useToast,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

function ProjectStatus({ projectInfoContext }) {
   const steps = [
      { title: "Waiting validation" },
      { title: "NFT Sale Open" },
      { title: "Funds Request open" },
      { title: "Closed" },
   ];

   return (
      <div>
         {" "}
         <div>
            <Box marginLeft="60px" marginRight="60px">
               <Stepper size="lg" index={projectInfoContext.status}>
                  {steps.map((step) => (
                     <Step key={uuidv4()}>
                        <StepIndicator>
                           <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                           />
                        </StepIndicator>

                        <Box flexShrink="0">
                           <StepTitle>{step.title}</StepTitle>
                        </Box>

                        <StepSeparator />
                     </Step>
                  ))}
               </Stepper>
            </Box>
         </div>
      </div>
   );
}

export default ProjectStatus;
