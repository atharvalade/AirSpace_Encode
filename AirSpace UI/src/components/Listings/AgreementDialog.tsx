"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { DeploymentProgress } from './DeploymentProgress';

interface AgreementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: string | null;
  loading: boolean;
  nft: {
    token_id: number;
    contract_address: string;
  } | null;
}

export type StepStatus = 'waiting' | 'loading' | 'completed' | 'failed';

export interface Step {
  title: string;
  description: string;
  status: StepStatus;
}

interface DeploymentResponse {
  decision: 'EXECUTE' | 'REJECT';
  deployment_status: 'success' | 'failed';
  deployment_output: string;
  model_response: string;
}

export const AgreementDialog = ({ isOpen, onClose, agreement, loading, nft }: AgreementDialogProps) => {
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [deploymentStatus, setDeploymentStatus] = useState<'success' | 'failed' | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    {
      title: "Validating with FAA",
      description: "Confirming air rights with Federal Aviation Administration",
      status: 'waiting' as StepStatus
    },
    {
      title: "User Validation",
      description: "Verifying buyer and seller credentials",
      status: 'waiting' as StepStatus
    },
    {
      title: "Smart Contract Execution",
      description: "Initiating blockchain transaction",
      status: 'waiting' as StepStatus
    },
    {
      title: "USDC Transfer",
      description: "Processing payment",
      status: 'waiting' as StepStatus
    },
    {
      title: "NFT Transfer",
      description: "Updating ownership records",
      status: 'waiting' as StepStatus
    }
  ]);

  const handleApprove = async () => {
    if (!nft) return;
    
    setShowProgress(true);
    setApprovalLoading(true);

    try {
      // Start FAA validation
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps[0].status = 'loading';
        return newSteps;
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update FAA validation status
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps[0].status = 'completed';
        newSteps[1].status = 'loading';
        return newSteps;
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user validation status
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps[1].status = 'completed';
        newSteps[2].status = 'loading';
        return newSteps;
      });
      setCurrentStep(2);

      // Execute hardhat command
      const response = await fetch('/api/execute-hardhat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId: nft.token_id
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Update remaining steps sequentially
        for (let i = 2; i < steps.length; i++) {
          setCurrentStep(i);
          setSteps(prevSteps => {
            const newSteps = [...prevSteps];
            newSteps[i].status = 'loading';
            return newSteps;
          });
          
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          setSteps(prevSteps => {
            const newSteps = [...prevSteps];
            newSteps[i].status = 'completed';
            return newSteps;
          });
        }
        setDeploymentStatus('success');
      } else {
        console.error('Deployment failed:', data.output);
        setSteps(prevSteps => {
          const newSteps = [...prevSteps];
          newSteps[currentStep].status = 'failed';
          return newSteps;
        });
        setDeploymentStatus('failed');
      }
    } catch (error) {
      console.error('Error during deployment:', error);
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps[currentStep].status = 'failed';
        return newSteps;
      });
      setDeploymentStatus('failed');
    } finally {
      setApprovalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark_grey rounded-3xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto mx-4">
        {!showProgress ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-24 font-medium">Legal Agreement</h2>
              <button 
                onClick={onClose}
                className="text-muted hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {loading ? (
              <div className="text-white text-center py-8">Loading agreement...</div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{agreement || ''}</ReactMarkdown>
              </div>
            )}
            
            <div className="mt-8 flex justify-end gap-4">
              <button 
                onClick={onClose}
                className="bg-deepSlate text-white px-6 py-2 rounded-lg hover:bg-opacity-80"
                disabled={approvalLoading}
              >
                Reject
              </button>
              <button 
                onClick={handleApprove}
                className="bg-primary text-darkmode px-6 py-2 rounded-lg hover:bg-opacity-90"
                disabled={approvalLoading}
              >
                Approve
              </button>
            </div>
          </>
        ) : (
          <div className="py-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-white text-24 font-medium">
                Processing Transaction
              </h2>
              {deploymentStatus && (
                <button 
                  onClick={onClose}
                  className="text-muted hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <DeploymentProgress 
              steps={steps}
              currentStep={currentStep}
              deploymentStatus={deploymentStatus}
              nftTokenId={nft?.token_id}
            />
          </div>
        )}
      </div>
    </div>
  );
}; 