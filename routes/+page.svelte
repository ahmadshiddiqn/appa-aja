<script>
  import { goto } from '$app/navigation';
  
  // Auto-redirect to /gaji-calculator after a brief moment
  setTimeout(() => {
    goto('/gaji-calculator');
  }, 500);
</script>

<svelte:head>
  <title>appa-aja - Tools Collection</title>
  <meta http-equiv="refresh" content="0;url=/gaji-calculator" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-base-100">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">🔧 appa-aja</h1>
    <p class="text-lg text-gray-600 mb-4">Tools Collection</p>
    <a href="/gaji-calculator" class="btn btn-primary">Open GajiBener →</a>
  </div>
</div>
