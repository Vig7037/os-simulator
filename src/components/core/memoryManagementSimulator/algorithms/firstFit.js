export function firstFit(blocks, processes) {
  let blockObjs = blocks.map(size => ({ size, status: 'free' }));
  let allocation = Array(processes.length).fill(-1);
  let blockAlloc = blocks.map(() => []);
  let blockUsed = Array(blocks.length).fill(false);
  for (let i = 0; i < processes.length; i++) {
    for (let j = 0; j < blockObjs.length; j++) {
      if (!blockUsed[j] && blockObjs[j].size >= processes[i]) {
        allocation[i] = j;
        blockAlloc[j].push({ process: i, size: processes[i] });
        blockObjs[j].size -= processes[i];
        blockUsed[j] = true;
        break;
      }
    }
  }
  return { allocation, blockAlloc, blockStatus: blockObjs.map(b => b.size) };
} 