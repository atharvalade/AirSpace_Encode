import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { tokenId } = await request.json();
    const command = `cd "/Users/atharvalade/Documents/AirSpace Smart Contract" && npx hardhat deploy --nft-id ${tokenId} --network sepolia`;
    
    console.log('\n🚀 Executing Hardhat command:', command, '\n');
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stdout) {
      console.log('📝 Command output:', '\n', stdout);
    }
    
    if (stderr) {
      console.error('❌ Command error:', '\n', stderr);
      return NextResponse.json({ status: 'failed', output: stderr }, { status: 500 });
    }
    
    return NextResponse.json({ status: 'success', output: stdout });
  } catch (error: any) {
    console.error('❌ Execution error:', '\n', error.message || error);
    return NextResponse.json(
      { status: 'failed', output: error.message || 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 