var axios = require("axios");

const cookie =
  "csrftoken=at7uhaERYL72clDpkS8eC9J6KYWnp9vL; sessionid=aj783ld8xiex1j7ztyp9cki9x8hn0zro; university_id=2780; platform_id=3; xtbz=cloud; platform_type=1";
const token = "at7uhaERYL72clDpkS8eC9J6KYWnp9vL";
const copyData = {
  i: 5,
  et: "pause",
  p: "web",
  n: "ali-cdn.xuetangx.com",
  lob: "cloud4",
  cp: 1.5,
  fp: 0,
  tp: 0,
  sp: 1,
  ts: "1663241707526",
  u: 30308551,
  uip: "",
  c: 1776058,
  v: 19971313,
  skuid: 5246357,
  classroomid: "12052179",
  cc: "6A2D1C233CA0D2F09C33DC5901307461",
  d: 702.1,
  pg: "19971313_14rdr",
  sq: 8,
  t: "video",
  cards_id: 0,
  slide: 0,
  v_url: "",
};

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time * 1000);
  });
}

start();

async function start() {
  for (let i = 19971223; i <= 19971315; i++) {
    console.log(`课程${i}开始...`);
    request_start_all(i);
    console.log(`睡眠60秒...`);
    await sleep(60);
  }
}

function request_start_all(classId) {
  let sq = 0;
  const args = process.argv.slice(2);
  let i = args.length > 0 ? args[0] * 1 : 2;
  let end = args.length > 0 ? args[1] * 1 : copyData.d;
  heart_data = [];
  for (i; i < end; i++) {
    heart_data.push({
      i: 5,
      et: "heartbeat",
      p: "web",
      n: "ali-cdn.xuetangx.com",
      lob: "cloud4",
      cp: i,
      fp: 0,
      tp: 0,
      sp: 1,
      ts: new Date().getTime(),
      u: copyData.u,
      uip: "",
      c: copyData.c,
      v: classId,
      skuid: copyData.skuid,
      classroomid: copyData.classroomid,
      cc: copyData.cc,
      d: copyData.d,
      pg: copyData.pg,
      sq: sq,
      t: "video",
      cards_id: 0,
      slide: 0,
      v_url: "",
    });
    sq++;
  }

  var config = {
    method: "post",
    url: "https://cejlu.yuketang.cn/video-log/heartbeat/?xtbz",
    headers: {
      "x-csrftoken": token,
      xtbz: "cloud",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33",
      "Content-Type": "application/json",
      cookie,
    },
    data: JSON.stringify({ heart_data }),
  };
  axios(config)
    .then((res) => {
      console.log(`课程${classId}完成`);
    })
    .catch((e) => {
      console.log(e);
    });
}
