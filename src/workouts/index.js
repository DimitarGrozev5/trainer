import addARep from "./add-a-rep-a-day/add-a-rep";
import enduroGrip from "./enduro-grip/enduro-grip";
import etkPressLadder from "./etk/etk";
// import hikingWithWeight from "./hiking-kg";
import quickDead from "./quick-dead/quick-dead";

const workoutsStore = new Map();
workoutsStore.set("etk-press-ladder", etkPressLadder());
// workoutsStore.set("hiking-with-weight", hikingWithWeight());
workoutsStore.set("slow-twitch-hell", enduroGrip());
workoutsStore.set("add-a-rep", addARep());
workoutsStore.set("qd", quickDead());

export default workoutsStore;
