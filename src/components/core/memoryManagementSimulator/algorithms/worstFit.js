export function worstFit(blocks, processes) {
  let blockObjs = blocks.map(size => ({ size, status: 'free' }));
  let allocation = Array(processes.length).fill(-1);
  let blockAlloc = blocks.map(() => []);
  let blockUsed = Array(blocks.length).fill(false);
  for (let i = 0; i < processes.length; i++) {
    let worstIdx = -1, maxWaste = -1;
    for (let j = 0; j < blockObjs.length; j++) {
      if (!blockUsed[j] && blockObjs[j].size >= processes[i] && (blockObjs[j].size - processes[i]) > maxWaste) {
        maxWaste = blockObjs[j].size - processes[i];
        worstIdx = j;
      }
    }
    if (worstIdx !== -1) {
      allocation[i] = worstIdx;
      blockAlloc[worstIdx].push({ process: i, size: processes[i] });
      blockObjs[worstIdx].size -= processes[i];
      blockUsed[worstIdx] = true;
    }
  }
  return { allocation, blockAlloc, blockStatus: blockObjs.map(b => b.size) };
} 