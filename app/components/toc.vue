<template>
    <div :class="['toc', { 'fixed-top': isFixedTop }]" ref="tocContainer" v-if="toc.length">
        <div class="toc-container" :style="{ height: tocHeight + 'px' }">
            <div class="title">导航目录
            </div>
            <ul class="list">
                <li v-for="item in toc" :key="item.id" :class="['toc-item', `toc-item-${item.level}`]"
                    :style="{ paddingLeft: `${(item.level - 1) * 20}px` }">
                    <a :href="'#' + item.id" @click.prevent="scrollToHeader(item.id)">{{ item.text }}</a>
                </li>
            </ul>
        </div>
        <t-button>hhh</t-button>
    </div>
</template>
  
<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

export default {
    name: 'TableOfContents',
    setup(props, { emit }) {
        const toc = ref([]);
        const tocContainer = ref(null);
        const tocHeight = ref(0);
        const isFixedTop = ref(false);

        const generateTOC = () => {
            const headers = document.querySelector('.editor').querySelectorAll('h1, h2, h3, h4, h5, h6');
            const tocArray = [];

            headers.forEach((header, index) => {
                const id = `header-${index}`;
                header.id = id;

                tocArray.push({
                    id,
                    text: header.innerText,
                    level: parseInt(header.tagName.charAt(1)) // 获取标题级别
                });
            });

            toc.value = tocArray;
            calculateTOCHeight();
        };

        const scrollToHeader = async (id) => {
            await nextTick();
            const header = document.getElementById(id);
            if (header) {
                header.scrollIntoView({ behavior: 'smooth' });
            }
        };

        const calculateTOCHeight = () => {
            if (tocContainer.value) {
                const containerTop = tocContainer.value.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                tocHeight.value = windowHeight - containerTop;
            }
        };

        const getContainer = () => {
            return document.getElementById('mainContent');
        };

        const onResize = () => {
            calculateTOCHeight();
        };

        const onScroll = () => {
            calculateTOCHeight();
        };

        const observeToc = () => {

            setTimeout(() => {
                const observer = new IntersectionObserver((entries) => {

                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            console.log(11);
                            isFixedTop.value = false;
                        } else {
                            console.log(22);
                            isFixedTop.value = true;
                        }
                    });
                }, { threshold: [0] }); // 当交叉比例为0时触发回调

                if (tocContainer.value) {
                    observer.observe(tocContainer.value);
                }
            }, 0);

        };

        onMounted(() => {
            generateTOC();
            window.addEventListener('resize', onResize);
            window.addEventListener('scroll', onScroll);
            calculateTOCHeight();
            observeToc();
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onScroll);
        });

        return {
            toc,
            tocContainer,
            tocHeight,
            isFixedTop,
            scrollToHeader,
            getContainer
        };
    }
};
</script>
  
<style lang="scss">
.toc {
    position: absolute;
    top: 0;
    right: 24px;
    z-index: 500;
    transition: top 0.3s;


    .toc-container {
        position: sticky;
        padding: 8px 16px;
        background-color: #fff;
        border: 1px solid #eee;
        overflow-y: auto;
        max-height: calc(100vh - 56px);


        .title {
            font-weight: 700;
            font-size: 20px;
            line-height: 28px;
            border-bottom: 1px solid #eee;
        }

        .toc-item {
            transition: padding-left 0.2s ease;
        }

        ul {
            list-style-type: none;
            padding: 0;
        }

        li {
            margin: 5px 0;
        }

        a {
            text-decoration: none;
            color: #007bff;
            font-weight: 600;
            transition: color 0.3s, font-weight 0.3s;
        }

        a:hover {
            text-decoration: underline;
            color: #0056b3;
        }
    }
}
</style>
  