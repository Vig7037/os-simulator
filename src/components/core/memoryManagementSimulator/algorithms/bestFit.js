export function bestFit(blocks, processes) {
  let blockObjs = blocks.map(size => ({ size, status: 'free' }));
  let allocation = Array(processes.length).fill(-1);
  let blockAlloc = blocks.map(() => []);
  let blockUsed = Array(blocks.length).fill(false);
  for (let i = 0; i < processes.length; i++) {
    let bestIdx = -1, minWaste = Infinity;
    for (let j = 0; j < blockObjs.length; j++) {
      if (!blockUsed[j] && blockObjs[j].size >= processes[i] && (blockObjs[j].size - processes[i]) < minWaste) {
        minWaste = blockObjs[j].size - processes[i];
        bestIdx = j;
      }
    }
    if (bestIdx !== -1) {
      allocation[i] = bestIdx;
      blockAlloc[bestIdx].push({ process: i, size: processes[i] });
      blockObjs[bestIdx].size -= processes[i];
      blockUsed[bestIdx] = true;
    }
  }
  return { allocation, blockAlloc, blockStatus: blockObjs.map(b => b.size) };
} 