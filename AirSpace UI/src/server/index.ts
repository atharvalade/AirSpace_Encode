import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import type { Request, Response } from 'express';

const app = express();

// More permissive CORS configuration for testing
app.use(cors({
  origin: true, // Allow all origins for testing
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));

app.use(express.json());

interface HardhatRequest {
  tokenId: number;
}

// Updated route handler with proper type annotations
app.post('/execute-hardhat', (req: Request<{}, {}, HardhatRequest>, res: Response) => {
  const { tokenId } = req.body;
  const command = `cd "/Users/atharvalade/Documents/AirSpace Smart Contract" && npx hardhat deploy --nft-id ${tokenId} --network sepolia`;
  
  exec(command, (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`Error: ${error}`);
      return res.status(500).json({ status: 'failed', output: stderr });
    }
    res.json({ status: 'success', output: stdout });
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled for all origins');
}); 