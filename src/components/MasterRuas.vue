<template>
    <div>
        <h1>{{title}}</h1>


        <b-button style="margin: 50px 0px 0px;" @click="_addRuas()">Tambah Data</b-button>
  
        <b-row style="margin-top:10px">
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
        <b-table :key="forcekey" 
                :items="ruasList" 
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
              <template #cell(action)="data">
                <div>
                    <span @click="_showEdit(data.item)"><font-awesome-icon icon="fa-pencil" /></span>
                    <span @click="_showDetail(data.item)"><font-awesome-icon icon="fa-eye" /></span>
                    <span @click="_showDelete(data.item)"><font-awesome-icon icon="fa-trash" /></span>
                </div>
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

    <b-modal ref="modal-delete" size="sm" title="Konfirmasi Hapus Ruas" ok-title="Hapus" @ok="_deleteRuas()">
        <div>
            Apakah Anda Yakin Ingin Menghapus Data Ruas ini?
        </div>
    </b-modal>
      
      <b-modal ref="modal-add" size="lg" :hide-footer="isView" :title="isView ?'Detail Ruas':'Tambah Ruas'" ok-title="Simpan" @ok="_saveRuas()">
        <div style="width:100%">
            <div>
                <label >Unit Kerja</label>
                <v-select
                    v-model="ruasData.unit"
                    :options="unitList"
                    :clearable="false"
                    :disabled="isView"
                    class="style-chooser"
                />
            </div>
            <div>
                <label >Ruas</label>
                <b-form-input v-model="ruasData.ruas" :disabled="isView"></b-form-input>
            </div>
            <div>
                <label>Gambar</label>
                <b-form-file v-model="ruasData.picture" :disabled="isView" accept="image/*"></b-form-file>
            </div>
            <div>
                <label for="example-datepicker">Choose a date</label>
                <b-form-datepicker  v-model="ruasData.date_create" :disabled="isView"></b-form-datepicker>
            </div>
            <div>
                <label style="align-self: end;">Status</label>
                <v-select
                    v-model="ruasData.status"
                    :options="statusList"
                    :clearable="false"
                    class="style-chooser"
                    :disabled="isView"
                />
            </div>
        </div>
      </b-modal>
    </div>
  </template>
  
  <script>
  import vSelect from 'vue-select'
  
  export default {
    components:{
      vSelect,
    },
    data(){
      return{
        title:"Daftar Ruas",
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
            { key: 'action', label: 'Action' },
          ],
        perPageOptions : [5, 10, 15],
  
        modalImage:"",
        searchTxt:"",
        allList:[],

        unitList:[],
        statusList:[
            {id:"active", label:"Active"},
            {id:"inavtive", label:"Inactive"},
        ],
        
        ruasData:{
            unit:"",
            ruas:"",
            picture:null,
            date_create:"",
            status:"",
        },
        tempId:"",
        isView:false,
        isEdit: false,
        forcekey:0

      }
    },
    methods: {
      toggleBusy() {
        this.isBusy = !this.isBusy
      },
      groupByUnit(){
            const result = []
            this.allList.forEach(item => {
                let find = result.filter((fnd)=>{
                    return fnd.id == item['unit']
                })
            
                if (find == undefined || find.length == 0){
                    result.push({id: item['unit'], label: item['unit']}) 
                }
            })
            return result
      },
      _showEdit(item){
        this.isEdit = true
        this.isView = false
        this.tempId = item.id

        this.ruasData = {
            unit:item.unit,
            ruas:item.ruas,
            picture:null,
            date_create: item.date_create,
            status:"",
        }

        this.$refs['modal-add'].show()
      },
      _showDetail(item){
        this.isView = true
        this.isEdit = false

        this.ruasData = {
            unit:item.unit,
            ruas:item.ruas,
            picture:null,
            date_create: item.date_create,
            status:"",
        }

        this.$refs['modal-add'].show()
      },
      _showDelete(item){
        this.tempId = item.id
        this.$refs['modal-delete'].show()
      },
      _deleteRuas(){
        this.isBusy = true

        this.axios.delete(`https://630c319983986f74a7bb0dc5.mockapi.io/jm/ruas/ruas/${this.tempId}`).then((response) => {
                let findIndex = this.ruasList.findIndex((item)=>{  return item.id == this.tempId})
                this.ruasList.splice(findIndex, 1)

                this.totalRows = this.ruasList.length
                
                this.isBusy = false
            })
      },
      _saveRuas(){
        this.isBusy = true

        if(this.isEdit){
            this.axios.put(`https://630c319983986f74a7bb0dc5.mockapi.io/jm/ruas/ruas/${this.tempId}`,
            { unit:this.ruasData.unit.id , ruas:this.ruasData.ruas , date_create:this.ruasData.date_create }
             ).then((response) => {
                let findIndex = this.ruasList.findIndex((item)=>{  return item.id == response.data.id})

                this.ruasList[findIndex] = response.data
               
                this.isBusy = false
                this.forcekey++
            })

        }else{
            this.axios.post(`https://630c319983986f74a7bb0dc5.mockapi.io/jm/ruas/ruas`,
            { unit:this.ruasData.unit.id , ruas:this.ruasData.ruas ,  date_create:this.ruasData.date_create }
             ).then((response) => {
                let find = this.ruasList.filter((ruas)=>{
                    return ruas.id == response.data.id
                })

                if(find == undefined || find.length == 0){
                    this.ruasList.push(response.data)
                    this.allList.push(response.data)

                    this.totalRows = this.ruasList.length
                }
               
                this.isBusy = false
            })
        }
      },
      _addRuas(){
        this.isView = false
        this.isEdit = false

        this.ruasData = {
            unit:"",
            ruas:"",
            picture:null,
            date:"",
            status:"",
        }

        this.$refs['modal-add'].show()
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
          this.unitList = this.groupByUnit()
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