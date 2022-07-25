<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" @close="closeFunction" class="relative z-10">
      <!-- Modal dark background -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      </TransitionChild>

      <!-- Modal foreground -->
      <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex min-h-full items-end sm:items-center justify-center p-4 sm:p-0 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300 "
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="relative bg-white w-full rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg">

              <slot></slot>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'

export default {
  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
  },
  props: ['open', 'closeFunction'],
}
</script>
