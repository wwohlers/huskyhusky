<template>
  <div>
    Pick month/year OR Search
    <ArticleItem v-for="article in articles" :key="article.id" :article="article"></ArticleItem>
  </div>
</template>

<script>
import ArticleItem from './ArticleItem';
import {http} from '../../global';

export default {
  name: 'ArchiveList',
  components: {
    ArticleItem,
  },
  data() {
    return {
      articles: []
    }
  },
  mounted() {
    const self = this;
    const url = http + '/articles';
    this.axios.get(url)
    .then((response) => {
      self.articles = response.data.articles;
    })
  }
}
</script>