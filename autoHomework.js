const axios = require("axios");
const FormData = require("form-data");

const SKUID = "5246357";
const CLASS_ROOM_ID = 12052179;
const TOKEN = "H6Gd2DQqxgWSodkyyLJaEulbZqrqTDoD"
const COOKIE = "university_id=2780; platform_id=3; xtbz=cloud; platform_type=1; csrftoken=H6Gd2DQqxgWSodkyyLJaEulbZqrqTDoD; sessionid=4ltcsjjrlo1dfz5jdnnknepo3cc9tj1b"

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time * 1000);
  });
}


getSchedule();

function getSchedule() {
  var config = {
    method: 'get',
    url: `https://cejlu.yuketang.cn/c27/online_courseware/schedule/score_detail/single/${SKUID}/0/?term=latest`,
    headers: {
      'xtbz': 'cloud',
      'x-csrftoken': TOKEN,
      'cookie': COOKIE
    }
  };

  axios(config)
    .then(async function (response) {
      const course_list = response.data.data.leaf_level_infos
      for (let i = 0; i < course_list.length; i++) {
        if (course_list[i].leaf_type_id
          // && course_list[i].schedule != 1
        ) {
          getProblemList(course_list[i].leaf_type_id);
          await sleep(25)
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getProblemList(excercise_id) {
  var data = new FormData();
  data.append(
    "txid",
    "745073020adfafe43a521c86308575315dd021adbc2c101c908e278c57137b65"
  );

  var config = {
    method: "get",
    url: `https://cejlu.yuketang.cn/mooc-api/v1/lms/exercise/get_exercise_list/${excercise_id}/${SKUID}/?term=latest&uv_id=2780`,
    headers: {
      cookie:
        COOKIE,
      "x-csrftoken": TOKEN,
      xtbz: "cloud",
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(async function (response) {
      const problems = response.data.data.problems;
      for (let i = 0; i < problems.length; i++) {
        getProblemAnswerAndApply(problems[i].problem_id);
        await sleep(5)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getProblemAnswerAndApply(problemId) {
  var config = {
    method: "get",
    url: `https://cejlu.yuketang.cn/c27/online_courseware/problem/get_problem_detail/${problemId}/`,
    headers: {
      xtbz: "cloud",
      "x-csrftoken": TOKEN,
      cookie:
        COOKIE,
    },
  };

  axios(config)
    .then(function (response) {
      const { Answer, ProblemID } = response.data.data;
      applyAnswer(ProblemID, Answer);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function applyAnswer(problemId, answer) {
  let answer_parameters = []
  let data
  try {
    data = JSON.stringify({
      classroom_id: CLASS_ROOM_ID,
      problem_id: problemId * 1,
      answer: Array.isArray(answer) ? answer : answer.split(""),
    });
  } catch (e) {
    console.log(e.messsage)
  }

  var config = {
    method: "post",
    url: "https://cejlu.yuketang.cn/mooc-api/v1/lms/exercise/problem_apply/?term=latest&uv_id=2780",
    headers: {
      "x-csrftoken": TOKEN,
      cookie:
        COOKIE,
      xtbz: "cloud",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(`回答完毕 ID:${problemId} ANSWER: ${answer}`);
    })
    .catch(async function (error) {
      if (error.response.data.detail.indexOf("throttled") > -1) {
        console.log("请求平凡，20秒后重试...", problemId)
        await sleep(20)
        console.log("准备重试...", problemId)
        applyAnswer(problemId, answer)
      }
    });
}
