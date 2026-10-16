import hero from "@/assets/main-pig.jpg";
import coast from "@/assets/sichang-bridge.jpg";
import skylab from "@/assets/skylab.jpg.asset.json";
import chongkaokard from "@/assets/chongkaokard.jpg";
import hardyaitim from "@/assets/hard-yaitim.jpg";
import khaonoi from "@/assets/khao-noi.jpg";
import montop from "@/assets/montop.jpg";
import prapakarnday from "@/assets/prapakarn-day.jpg";
import prapakarnnight from "@/assets/prapakarn-night.jpg";
import sanjaoguanim from "@/assets/sanjao-guanim.jpg";
import sanjaoporky from "@/assets/sanjaopor-ky.jpg";
import aoussadang from "@/assets/aoussadang.png";
import pumabank from "@/assets/pumabank.png";
import market from "@/assets/market.jpg";
import laamjak from "@/assets/laamjak.png";
import sunrise from "@/assets/sunrise.jpg";
import batic from "@/assets/batic.jpg";
import pareehut from "@/assets/pareehut.jpg";
import seawaak from "@/assets/seawaak.jpg";
import prajuthatu from "@/assets/prajuthatu.jpg";
import talucave2 from "@/assets/talucave2.jpg";
import gamerai from "@/assets/gamerai.jpg";
import destiny from "@/assets/destiny.png";
import queng from "@/assets/queng.png";
import biggun from "@/assets/biggun.jpg";
import timeline from "@/assets/timelinee.jpg";
import workshop from "@/assets/workshop.jpg";
import khamyai from "@/assets/khamyai.jpg";
import squid from "@/assets/squid.jpg";
import swim from "@/assets/swim.jpg";
import greenbridge from "@/assets/greenbridge.jpg";
import islandish from "@/assets/islandish.png";
import dinner from "@/assets/dinner.jpeg";
export const travelImages = { hero: hero, coast: coast, skylab: skylab.url, chongkaokard:chongkaokard, hardyaitim:hardyaitim
  , khaonoi:khaonoi, montop:montop, prapakarnday:prapakarnday ,prapakarnnight:prapakarnnight,sanjaoguanim:sanjaoguanim
  , sanjaoporky:sanjaoporky, aoussadang:aoussadang, pumabank:pumabank, talucave2:talucave2, laamjak:laamjak
, sunrise:sunrise , batic:batic, pareehut:pareehut, seawaak:seawaak, prajuthatu:prajuthatu
,destiny:destiny, gamerai:gamerai, queng:queng, biggun:biggun, timeline:timeline,market:market
, workshop:workshop, khamyai:khamyai, squid:squid, swim:swim, greenbridge:greenbridge, islandish:islandish, dinner:dinner
};

export type TravelImage = keyof typeof travelImages | `/${string}` | `https://${string}`;

export function resolveTravelImage(image: TravelImage): string {
  return image in travelImages ? travelImages[image as keyof typeof travelImages] : image;
}
