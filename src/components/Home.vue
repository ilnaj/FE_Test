<template>
  <div>
      <h1>{{title}}</h1>

      <Grafik-Chart :items="ruasList"></Grafik-Chart>

      <Gallery-Item :items="ruasList" @onClick="_showImageModal"></Gallery-Item>

      <b-row style="margin-top:20px">
        <b-col>
          <b-row style="padding: 25px 10px 0px;">
            <label style="align-self: end;">Show</label>
            <v-select
              v-model="perPage"
              :options="perPageOptions"
              :clearable="false"
              style="padding-left: 20px; width: 120px"
              class="style-chooser"
            />
            <label style="align-self: end;">&nbsp; Entries</label>
          </b-row>
        </b-col>
        <b-col style="float:right">
          <b-row style="float: right; padding: 20px 15px 0px;">
            <b-form-input
              v-model="searchTxt"
              placeholder="Search"
              debounce="500"
              style="width:300px"
              @keyup.enter="_onSearch()"
            />
            <b-button @click="_onSearch()">Search</b-button>
          </b-row>
        </b-col>
         

          
      </b-row>
      <b-table :items="ruasList" 
                :fields="fields" 
                :busy="isBusy"   
                :per-page="perPage" 
                :current-page="currentPage" 
                class="mt-3" outlined>

            <template #table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>

            <template #head(id)>
              <div>No</div>
            </template>
            <template #head(ruas)>
              <div>Ruas</div>
            </template>
            <template #head(unit)>
              <div>Unit Kerja</div>
            </template>
            <template #head(picture)>
              <div>Gambar</div>
            </template>
            <template #head(date_create)>
              <div>Tanggal</div>
            </template>

            <template #cell(id)="data">
              <div>{{data.item.id}}</div>
            </template>
            <template #cell(ruas)="data">
              <div>{{data.item.ruas}}</div>
            </template>
            <template #cell(unit)="data">
              <div>{{data.item.unit}}</div>
            </template>
            <template #cell(picture)="data">
              <b-button @click="_showImageModal(data.item.picture)">Preview Image</b-button>
            </template>
            <template #cell(date_create)="data">
              <div>{{ convertDate(data.item.date_create) }}</div>
            </template>
    </b-table>

    <b-row>
      <b-col>
            <span class="text-muted">Showing {{ _paginationTxt('from') }} to {{ _paginationTxt('to') }} of {{ totalRows }} entries</span>
      </b-col>
      <b-col>
        <b-pagination
            page-class="customPage"
            align="right"
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="my-table"
        ></b-pagination>
      </b-col>
    </b-row>
    

    <b-modal ref="modal-image" size="lg" hide-footer hide-header>
      <div>
        <b-img :src="modalImage" style="width:100%"></b-img>
      </div>
    </b-modal>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import GalleryItem from './components/galleryItem.vue'
import GrafikChart from './components/grafikChart.vue'

export default {
  components:{
    vSelect,
    GalleryItem,
    GrafikChart
  },
  data(){
    return{
      title:"Home",
      isBusy: false,
      perPage: 5,
      currentPage: 1,
      totalRows:1,
      ruasList: [],
      fields: [
          { key: 'id', label: 'NO' },
          { key: 'ruas', label: 'Ruas' },
          { key: 'unit', label: 'Unit Kerja' },
          { key: 'picture', label: 'Gambar' },
          { key: 'date_create', label: 'Tanggal' },
        ],
      perPageOptions : [5, 10, 15],

      modalImage:"",
      searchTxt:"",
      allList:[]
    }
  },
  methods: {
    toggleBusy() {
      this.isBusy = !this.isBusy
    },
    _showImageModal(url){
      this.modalImage = url
      this.$refs['modal-image'].show()
    },
    _paginationTxt(type){
      if(type=="from"){
        if(this.currentPage == 1){
            return this.currentPage
          }else{
            return ( (this.currentPage-1) * this.perPage ) + 1
          }
      }else if(type=="to"){
        let result = this.perPage * this.currentPage
        if(result > this.totalRows){
          return this.totalRows
        }else{
          return result
        }
      }
    },
    convertDate(date_create){
      let monthNamelist = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

      let newDate = new Date(date_create)
      let year = newDate.getFullYear()
      let month = monthNamelist[newDate.getMonth()]
      let day = newDate.getDate().toString().padStart(2, '0')

      return day + ' ' + month + ' ' + year
    },
    _onSearch(){
      this.isBusy = true
      this.ruasList = this.allList

      if(this.searchTxt != ""){
        let findList = []
        findList = this.allList.filter((item)=>{
          return this.convertDate(item.date_create).toUpperCase().includes(this.searchTxt.toUpperCase()) || item.unit.toUpperCase().includes(this.searchTxt.toUpperCase()) || item.ruas.toUpperCase().includes(this.searchTxt.toUpperCase()) 
        })

        this.ruasList = findList
      }

      this.totalRows = this.ruasList.length
      this.isBusy = false
    },
    async fetchData(){
      this.isBusy = true

      
      this.axios.get(`https://630c319983986f74a7bb0dc5.mockapi.io/jm/ruas/ruas`).then((response) => {
        console.log(response.data)
        this.ruasList = response.data
        this.allList = response.data

        this.totalRows = this.ruasList.length
      }).finally(() => {
        this.isBusy = false
      })

    },
  },
  created(){
    this.fetchData()

  }
}
</script>

<style>
.customPage.page-item.active .page-link {
  background-color: #3498db;
  border-color: #3498db;
  color:white
}
.customPage.page-item .page-link {
  color: #3498db;
}

.wrapper { 
    background:#EFEFEF; 
    box-shadow: 1px 1px 10px #999; 
    margin: auto; 
    text-align: center; 
    position: relative;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    margin-bottom: 20px !important;
    width: 800px;
    padding-top: 5px;
}
.scrolls { 
    overflow-x: scroll;
    overflow-y: hidden;
    white-space:nowrap
} 



</style>>