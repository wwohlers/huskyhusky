<template>
  <div>
    IMG Title: {{ article.title }}
    <router-link :to="articleLink">Click here</router-link>
  </div>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: Object
  },
  computed: {
    articleLink() {
      return "/article/" + this.article.name;
    }
  }
}
</script>