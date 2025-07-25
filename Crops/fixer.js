const fs = require('fs');

const items = {
  'easteregg': 2.85, 'moonflower': 1.9, 'starfruit': 2.85, 'pepper': 4.75, 'grape': 2.85, 'nightshade': 0.48,
  'mint': 0.95, 'glowshroom': 0.7, 'bloodbanana': 1.42, 'beanstalk': 9.5, 'coconut': 13.31, 'candyblossom': 2.85,
  'carrot': 0.24, 'strawberry': 0.29, 'blueberry': 0.17, 'orangetulip': 0.0499, 'tomato': 0.44, 'daffodil': 0.16,
  'watermelon': 7.3, 'pumpkin': 6.9, 'mushroom': 25.9, 'bamboo': 3.8, 'apple': 2.85, 'corn': 1.9, 'cactus': 6.65,
  'cranberry': 0.95, 'moonmelon': 7.6, 'durian': 7.6, 'peach': 1.9, 'cacao': 7.6, 'moonglow': 6.65, 'dragonfruit': 11.38,
  'mango': 14.28, 'moonblossom': 2.85, 'raspberry': 0.71, 'eggplant': 4.75, 'papaya': 2.86, 'celestiberry': 1.9,
  'moonmango': 14.25, 'passionfruit': 2.867, 'soulfruit': 23.75, 'chocolatecarrot': 0.2616, 'redlolipop': 3.7988,
  'candysunflower': 1.428, 'lotus': 18.99, 'pineapple': 2.85, 'hive': 7.59, 'lilac': 2.846, 'rose': 0.95, 'foxglove': 1.9,
  'purpledahlia': 11.4, 'sunflower': 15.65, 'pinklily': 5.699, 'nectarine': 2.807, 'honeysuckle': 11.4, 'lavender': 0.25,
  'venusflytrap': 9.5, 'nectarshade': 0.75, 'manuka': 0.289, 'emberlily': 11.4, 'dandelion': 3.79, 'lumira': 5.69,
  'cocovine': 13.3, 'succulent': 4.75, 'beebalm': 0.94, 'nectarthorn': 5.76, 'violetcorn': 2.85, 'bendboo': 17.09,
  'crocus': 0.285, 'sugarapple': 8.55, 'cursedfruit': 22.9, 'suncoil': 9.5, 'dragonpepper': 5.69, 'cauliflower': 4.74,
  'avocado': 3.32, 'kiwi': 4.75, 'greenapple': 2.85, 'banana': 1.42, 'pricklypear': 6.65, 'feijoa': 9.5, 'loquat': 6.17,
  'wildcarrot': 0.286, 'pear': 2.85, 'cantaloupe': 5.22, 'parasolflower': 5.7, 'rosydelight': 9.5, 'elephantears': 17.1,
  'bellpepper': 7.61, 'aloevera': 5.22, 'peacelily': 0.5, 'travelersfruit': 11.4, 'delphinium': 0.285,
  'lilyofthevalley': 5.69, 'guanabana': 3.8, 'pitcherplant': 11.4, 'rafflesia': 7.6, 'fireworkflower': 19,
  'libertylily': 6.176, 'boneblossom': 2.85, 'horneddinoshroom': 4.94, 'fireflyfern': 4.77, 'stonebite': 0.94,
  'boneboo': 14.5, 'paradisepetal': 2.85, 'burningbud': 11.4, 'fossilight': 3.79, 'amberspine': 5.7, 'grandvolcania': 6.65,
  'lingonberry': 0.485, 'giantpinecone': 5.14, 'horsetail': 2.85, 'monoblooma': 0.477, 'spikedmango': 14.25,
  'taroflower': 6.64, 'serenity': 0.24, 'zenflare': 1.34, 'zenrocks': 17.1, 'hinomai': 9.5, 'mapleapple': 2.85,
  'softsunshine': 1.9
};

function toDisplayName(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/([a-z])([0-9])/gi, '$1 $2')
    .trim()
    .split(/[\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const result = Object.keys(items).map(key => ({
  item_id: key,
  display_name: toDisplayName(key)
}));

fs.writeFileSync('items.json', JSON.stringify(result, null, 2));
console.log('✅ items.json has been created!');
