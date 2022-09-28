<template>
<div>
    <div style="font-size: 20px;">Image Gallery</div>
        <div class="wrappers">
        <div class="scrolls">
            <span v-for="(img,idx) in items" :key="idx" @click="_showImageModal(img.picture)">
                <b-img  class="galleryItem" :src="img.picture" style="width:200px; margin:10px"></b-img>
            </span>
        </div>
        </div>
</div>
</template>

<script>
export default {
    props:{
        items:{
            default : () => ([])
        }
    },
    methods:{
        _showImageModal(url){
            this.$emit("onClick",url)
        }
    }

}
</script>

<style>
.galleryItem{
  cursor:pointer
}
.galleryItem:hover{
		box-shadow: 0px 7px 15px -5px rgba(0, 0, 0, 0.3);
}

</style>