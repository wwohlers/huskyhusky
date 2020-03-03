<template>
  <div>
    Hi
    <h1>{{ article.title }}</h1>
  </div>
</template>

<script>
import Subscribe from '../components/Subscribe';
import Axios from 'axios';
import {http} from '../../global';

export default {
  name: 'Article',
  data() {
    return {
      article: [],
      notFound: false,
    }
  },
  components: {
    Subscribe
  },
  beforeRouteEnter (to, from, next) {
    const name = to.params.name;
    const url = http + "/articles/" + name;
    Axios.get(url)
    .then((response) => {
      if (response.status == 500) {
        next(vm => vm.fail());
      } else {
        next(vm => vm.load(response.data.article));
      }
    })
    .catch((error) => {
      console.log(error);
    })
  },
  beforeRouteUpdate (to, from, next) {
    const name = to.params.name;
    const url = http + "/articles/" + name;
    this.axios.get(url)
    .then((response) => {
      if (response.status != 200) {
        this.fail();
      } else {
        this.load(response.data.article);
      }
    })
    next();
  },
  methods: {
    load(article) {
      this.notFound = false;
      this.article = article;
    },

    fail() {
      this.notFound = true;
    }
  }
}
</script>