<template>
  <!-- need attention card -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-6">
      <attentionCard :assets="criticalAssets" />
    </div>

    <!-- doughnut chart -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <doughnutChartAsset />
    </div>

    <!-- progress eclipse -->
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
      <ProgressStatusCard />
    </div>"
</template>

<script setup lang="ts">
import attentionCard from '../../../components/card/assetAttentionCard.vue';
import doughnutChartAsset from '../../../components/card/doughnutChartAsset.vue';
import ProgressStatusCard from '../../../components/card/progressEclipse.vue';
import 'primeicons/primeicons.css';

interface Asset {
  assetId: string
  name: string
  location: string
  status: string
  issue: string
}

const criticalAssets: Asset[] = [

]

</script>
