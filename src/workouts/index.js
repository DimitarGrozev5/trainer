import enduroGrip from "./enduro-grip/enduro-grip";
import etkPressLadder from "./etk/etk";
import hikingWithWeight from "./hiking-kg";

const workoutsStore = new Map();
workoutsStore.set("etk-press-ladder", etkPressLadder());
workoutsStore.set("hiking-with-weight", hikingWithWeight());
workoutsStore.set("slow-twitch-hell", enduroGrip());

export default workoutsStore;
