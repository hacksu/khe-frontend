<template>
  <div class="sponsorlist">
    Sponsors for Kent Hack Enough
    <div v-for="(group, groupIndex) in sponsors" v-bind:key="groupIndex">
      <div v-for="sponsor in group" class="sponsor" :key="sponsor.id" :style="sponsor.styles">
        <img :src="sponsor.logo" :style="{ 'transform': `scale(${sponsor.scale})`, }">
      </div>
    </div>
  </div>
</template>

<script>

let ids = 0;
let sponsors = {};
class Sponsor {
  constructor(cfg) {
    Object.assign(this, {
      logo: false,
      name: false,
      link: false,
      style: {},
      scale: 1,
      id: ids++,
    })
    Object.assign(this, cfg || {});
    if (this.logo.substr(0, 2) == './') {
      this.logo = '/api/sponsors' + this.logo.substr(1);
    }
  }
  get styles() {
    return {
      // put extra here
      //'background-color': 'red',
      ...this.style,
    }
  }
}

export default {
  name: 'SponsorList',
  data() {
    return {
      styleTag: false,
      sponsors: [],
    }
  },
  mounted() {
    let this_ = this;
    fetch('/api/sponsors.json')
    .then(res => res.json())
    .then(list => {
      let sponsors2 = [];
      for (let group of list) {
        let group2 = [];
        if (!(group instanceof Array)) {
          group = [group];
        }
        for (let sponsor of group) {
          let existing = sponsors[sponsor.name];
          if (existing) {
            Object.assign(existing, sponsor);
          } else {
            existing = new Sponsor(sponsor);
            sponsors[sponsor.name] = existing;
          }
          group2.push(existing)
        }
        sponsors2.push(group2);
      }
      this_.sponsors = sponsors2;
    });
  },
};
</script>

<style scoped lang="scss">
@import "@/scss/components/SponsorList.scss"; // Essential SCSS

.sponsorlist {
  padding: 20px;
  display: inline-block;
  .sponsor {
    img {
      height: 15vmin;
      max-width: calc(23vmax - 60px);
      width: 100vw;
      padding: 20px;
    }
    transition: transform 0.25s;
    &:hover {
      transform: scale(1.1);
    }
  }
}

</style>
