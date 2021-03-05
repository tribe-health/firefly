<script lang="typescript">
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.import_success.title')}</Text>
            <Text type="p" secondary>{locale('views.import_success.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <!-- TODO: missing illustration -->
        <div slot="rightpane" class="w-full h-full" />
    </OnboardingLayout>
{/if}
