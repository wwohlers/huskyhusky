<template>
  <div class="home">
    <div v-if="articles">
      <p v-for="article in articles" :key="article.id">{{ article.title }}</p>
    </div>
    <Subscribe></Subscribe>
  </div>
</template>

<script>
// @ is an alias to /src
import Subscribe from '@/components/Subscribe.vue'
import {http} from '../../global';

export default {
  name: 'Home',
  components: {
    Subscribe
  },
  data() {
    return {
      articles: [],
    }
  },
  mounted() {
    const self = this;
    const url = http + '/top';
    this.axios.get(url)
    .then((response) => {
      self.articles = response.data.articles;
    })
  }
}
</script>
