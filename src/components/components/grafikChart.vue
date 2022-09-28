<template>
<div>
    <b-row>
        <b-col cols="4" style="padding:10px">
            <column-chart :data="barChart"></column-chart>
        </b-col>
        <b-col cols="4" style="padding:10px"> 
            <bar-chart :data="barChart"></bar-chart>
        </b-col>
        <b-col cols="4" style="padding:10px">
            <line-chart :data="lineChart"></line-chart>
        </b-col>
      </b-row>
</div>
</template>

<script>


export default {
    props:{
        items:{
            default : () => ([])
        }
    },
    components:{
        

    },
    data(){
        return{
            barChart:[],
            lineChart:[]

        }
    },
    watch:{
        items(){
            if(this.items.length > 0){
                this._processData()
            } 
        }
    },
    methods:{
        _processData(){
            this.barChart = []
            let result = this.groupByYear(this.items)
            for(let bar of result){
                this.barChart.push([bar.name , bar.items.length])
                this.lineChart.push([bar.name , bar.items.length])
            }
            console.log(this.barChart)
        },
        groupByYear(array){
            const result = []
            array.forEach(item => {
                let find = result.filter((fnd)=>{
                    return fnd.name == new Date(item['date_create']).getFullYear()
                })
            
                if (find == undefined || find.length == 0){
                    result.push({name:new Date(item['date_create']).getFullYear() , items:[{item}]}) 
                }else{
                    find[0].items.push(item)
                }
            })
            return result
        }
    },
    mounted(){
        console.log("a",this.items)

    }

}
</script>

<style>


</style>