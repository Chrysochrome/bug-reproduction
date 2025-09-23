// const { createStarryNight, common } = await import('@wooorm/starry-night');
import {common, createStarryNight} from '@wooorm/starry-night'
const starryNight = await createStarryNight(common)

const scope = starryNight.flagToScope('markdown')
if (!scope) throw new Error('Expected scope')
const tree = starryNight.highlight('# hi', scope)

const div = document.createElement('div');
div.style.whiteSpace = 'pre';
div.textContent = JSON.stringify(tree, null, 2);
document.body.appendChild(div);
