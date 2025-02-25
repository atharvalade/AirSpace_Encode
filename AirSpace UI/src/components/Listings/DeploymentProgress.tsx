"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { Step } from './AgreementDialog';

interface DeploymentProgressProps {
  steps: Step[];
  currentStep: number;
  deploymentStatus?: 'success' | 'failed' | null;
  nftTokenId?: number;
}

export const DeploymentProgress = ({ steps, currentStep, deploymentStatus, nftTokenId }: DeploymentProgressProps) => {
  const handleVerifyClick = () => {
    const etherscanUrl = `https://sepolia.etherscan.io/token/0x676AB843E8aDd6363779409Ee5057f4a26F46F59?a=${nftTokenId}`;
    window.open(etherscanUrl, '_blank');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-start gap-4"
          >
            <div className="relative flex items-center justify-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-500' :
                  step.status === 'failed' ? 'bg-red-500' :
                  step.status === 'loading' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                {step.status === 'completed' && <CheckCircle className="w-5 h-5 text-white" />}
                {step.status === 'failed' && <XCircle className="w-5 h-5 text-white" />}
                {step.status === 'loading' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute top-8 left-1/2 w-0.5 h-12 bg-gray-300"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
              )}
            </div>
            <div className="flex-1 pt-1">
              <motion.h3 
                className="text-lg font-medium text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.1 }}
              >
                {step.title}
              </motion.h3>
              <motion.p 
                className="text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.2 }}
              >
                {step.description}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {deploymentStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          {deploymentStatus === 'success' ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="inline-flex items-center gap-2 text-green-500">
                <CheckCircle className="w-12 h-12" />
                <span className="text-xl font-medium">Transaction Completed Successfully!</span>
              </div>
              <button
                onClick={handleVerifyClick}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
              >
                <span>Verify on Etherscan</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 text-red-500"
            >
              <XCircle className="w-12 h-12" />
              <span className="text-xl font-medium">Transaction Failed</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}; 