/** Pure completion-to-visual mapping. No animation may award progress. */
export function worldEffectState(day:number,complete:boolean,effectsEnabled=true){
 return {clouds:effectsEnabled&&complete&&(day===1||day===2),land:effectsEnabled&&complete&&day===2,star:effectsEnabled&&day===0};
}
