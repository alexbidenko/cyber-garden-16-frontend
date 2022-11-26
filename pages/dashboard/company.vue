<script lang="ts" setup>
import {ref} from "#imports";
import {useToast} from "primevue/usetoast";
const toast = useToast();

const data = ref({
  key: '0',
  type: 'person',
  styleClass: 'p-person',
  data: {label: 'CEO', name: 'Walter White', avatar: 'walter.jpg'},
  children: [
    {
      key: '0_0',
      type: 'person',
      styleClass: 'p-person',
      data: {label: 'CFO', name:'Saul Goodman', avatar: 'saul.jpg'},
      children:[{
        key: '0_0_0',
        data: {label: 'Tax'},
        selectable: false,
        styleClass: 'department-cfo'
      },
        {
          key: '0_0_1',
          data: {label: 'Legal'},
          selectable: false,
          styleClass: 'department-cfo'
        }],
    },
    {
      key: '0_1',
      type: 'person',
      styleClass: 'p-person',
      data: {label: 'COO', name:'Mike E.', avatar: 'mike.jpg'},
      children:[{
        key: '0_1_0',
        data: {label: 'Operations'},
        selectable: false,
        styleClass: 'department-coo'
      }]
    },
    {
      key: '0_2',
      type: 'person',
      styleClass: 'p-person',
      data: {label: 'CTO', name:'Jesse Pinkman', avatar: 'jesse.jpg'},
      children:[{
        key: '0_2_0',
        data: {label: 'Development'},
        selectable: false,
        styleClass: 'department-cto',
        children:[{
          key: '0_2_0_0',
          data: {label: 'Analysis'},
          selectable: false,
          styleClass: 'department-cto'
        },
          {
            key: '0_2_0_1',
            data: {label: 'Front End'},
            selectable: false,
            styleClass: 'department-cto'
          },
          {
            key: '0_2_0_2',
            data: {label: 'Back End'},
            selectable: false,
            styleClass: 'department-cto'
          }]
      },
        {
          key: '0_2_1',
          data: {label: 'QA'},
          selectable: false,
          styleClass: 'department-cto'
        },
        {
          key: '0_2_2',
          data: {label: 'R&D'},
          selectable: false,
          styleClass: 'department-cto'
        }]
    }
  ]
});
const data2 = ref({
  key: '0',
  data: {label: 'F.C. Barcelona'},
  children: [
    {
      key: '0_0',
      data: {label: 'F.C. Barcelona'},
      children: [
        {
          key: '0_0_0',
          data: {label: 'Chelsea F.C.'}
        },
        {
          key: '0_0_1',
          data: {label: 'F.C. Barcelona'}
        }
      ]
    },
    {
      key: '0_1',
      data: {label: 'Real Madrid'},
      children: [
        {
          key: '0_1_0',
          data: {label: 'Bayern Munich'}
        },
        {
          key: '0_1_1',
          data: {label: 'Real Madrid'}
        }
      ]
    }
  ]
});
const selection = ref({});
const onNodeSelect = (node: any) => {
  toast.add({severity:'success', summary: 'Node Selected', detail: node.data.label, life: 3000});
};
const onNodeUnselect = (node: any) => {
  toast.add({severity:'success', summary: 'Node Unselected', detail: node.data.label, life: 3000});
};
const onNodeExpand = (node: any) => {
  toast.add({severity:'success', summary: 'Node Expanded', detail: node.data.label, life: 3000});
};
const onNodeCollapse = (node: any) => {
  toast.add({severity:'success', summary: 'Node Collapsed', detail: node.data.label, life: 3000});
};
</script>

<template>
  <div class="companyPage">
    <client-only>
      <OrganizationChart :value="data" :collapsible="true" class="company" selectionMode="single" v-model:selectionKeys="selection"
                         @nodeSelect="onNodeSelect" @nodeUnselect="onNodeUnselect" @nodeCollapse="onNodeCollapse" @nodeExpand="onNodeExpand">
        <template #person="slotProps">
          <div class="node-header ui-corner-top">{{slotProps.node.data.label}}</div>
          <div class="node-content">
            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" width="32">
            <div>{{slotProps.node.data.name}}</div>
          </div>
        </template>
        <template #default="slotProps">
          <span>{{slotProps.node.data.label}}</span>
        </template>
      </OrganizationChart>
    </client-only>
  </div>
</template>

<style lang="scss">
.companyPage {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
