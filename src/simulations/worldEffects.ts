/** Pure completion-to-visual mapping. No animation may award progress. */
export function worldEffectState(day:number,complete:boolean,effectsEnabled=true,day2Complete=false){
 return {clouds:effectsEnabled&&(day===1?complete:day===2?day2Complete:false),land:effectsEnabled&&complete&&day===2,star:effectsEnabled&&day===0};
}
