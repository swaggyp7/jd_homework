const axios = require("axios");
const FormData = require("form-data");

const SKUID = "5246357";
const EXERCISE_ID = "2035909";
const CLASS_ROOM_ID = 12052179;

getProblemList();

function getProblemList() {
  var data = new FormData();
  data.append(
    "txid",
    "745073020adfafe43a521c86308575315dd021adbc2c101c908e278c57137b65"
  );

  var config = {
    method: "get",
    url: `https://cejlu.yuketang.cn/mooc-api/v1/lms/exercise/get_exercise_list/${EXERCISE_ID}/${SKUID}/?term=latest&uv_id=2780`,
    headers: {
      cookie:
        "sessionid=aj783ld8xiex1j7ztyp9cki9x8hn0zro; university_id=2780; platform_id=3; xtbz=cloud; platform_type=1; csrftoken=DfQKmGsEVm7lWh1VT8dfn7gODNubF6g5",
      "x-csrftoken": "DfQKmGsEVm7lWh1VT8dfn7gODNubF6g5",
      xtbz: "cloud",
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      const problems = response.data.data.problems;
      problems.forEach((problem) => {
        console.log(problem.problem_id);
        getProblemAnswerAndApply(problem.problem_id);
      });
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
      "x-csrftoken": "DfQKmGsEVm7lWh1VT8dfn7gODNubF6g5",
      cookie:
        "sessionid=aj783ld8xiex1j7ztyp9cki9x8hn0zro; university_id=2780; platform_id=3; xtbz=cloud; platform_type=1; csrftoken=DfQKmGsEVm7lWh1VT8dfn7gODNubF6g5",
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
  var data = JSON.stringify({
    classroom_id: CLASS_ROOM_ID,
    problem_id: problemId * 1,
    answer: [answer],
  });

  var config = {
    method: "post",
    url: "https://cejlu.yuketang.cn/mooc-api/v1/lms/exercise/problem_apply/?term=latest&uv_id=2780",
    headers: {
      "x-csrftoken": "DfQKmGsEVm7lWh1VT8dfn7gODNubF6g5",
      cookie:
        "sessionid=aj783ld8xiex1j7ztyp9cki9x8hn0zro; university_id=2780; platform_id=3; xtbz=cloud; platform_type=1; csrftoken=DfQKmGsEVm7lWh1VT8dfn7gODNubF6g5",
      xtbz: "cloud",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(response);
      console.log(JSON.stringify(response.data.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}
