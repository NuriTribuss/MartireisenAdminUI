<template>
  <a-layout
    :class="{
      air__layout__contentNoMaxWidth: settings.isContentNoMaxWidth,
      air__layout__appMaxWidth: settings.isAppMaxWidth,
      air__layout__grayBackground: settings.isGrayBackground,
      air__layout__squaredBorders: settings.isSquaredBorders,
      air__layout__cardsShadow: settings.isCardShadow,
      air__layout__borderless: settings.isBorderless,
    }"
  >
    <air-sidebar />
    <air-menu-left v-if="settings.menuLayoutType === 'left'" class="d-print-none" />
    <air-menu-top v-if="settings.menuLayoutType === 'top'" />
    <a-layout>
      <a-layout-header
        class="air__layout__header d-print-none"
        :class="{
          air__layout__fixedHeader: settings.isTopbarFixed,
          air__layout__headerGray: settings.isGrayTopbar,
        }"
      >
        <air-topbar />
      </a-layout-header>
      <a-layout-content>
        <div class="air__utils__content">
          <div class="card text-center pb-4" v-show="!$store.state.access">
            <img width="200" class="m-auto" src="https://image.freepik.com/free-vector/open-locker_53876-25497.jpg"/>
            <h2>{{$t('common.protect_area')}}</h2>
            <p>{{$t('common.protect_area_msg')}}</p>
              <a-button type="primary" class="m-auto" @click="$router.back();">
            <i class="fe fe-arrow-left mr-2"></i>
            {{ $t('btn.back') }}
          </a-button>
          </div>
          <transition :name="settings.routerAnimation" mode="out-in" >
            <nuxt v-show="$store.state.access" />
          </transition>
        </div>
      </a-layout-content>
      <a-layout-footer>
        <air-footer />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>


<script>
import { mapState } from "vuex";
import AirTopbar from "@/components/layout/TopBar";
import AirMenuLeft from "@/components/layout/MenuLeft";
import AirMenuTop from "@/components/layout/MenuTop";
import AirFooter from "@/components/layout/Footer";
import AirSidebar from "@/components/layout/Sidebar";

export default {
  name: "AppLayout",
  computed: mapState(["settings"]),
  components: { AirTopbar, AirMenuLeft, AirMenuTop, AirFooter, AirSidebar },
  mounted() {
   
    this.detectViewPort(true);
    window.addEventListener("resize", this.detectViewPortListener);
    
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.detectViewPortListener);
  },
  methods: {
    detectViewPortListener: function() {
      this.detectViewPort(false);
    },
    setViewPort: function(isMobileView = false, isTabletView = false) {
      this.$store.commit("settings/CHANGE_SETTING", {
        setting: "isMobileView",
        value: isMobileView
      });
      this.$store.commit("settings/CHANGE_SETTING", {
        setting: "isTabletView",
        value: isTabletView
      });
    },
    detectViewPort: function(firstLoad = false) {
      const isMobile = this.settings["isMobileView"];
      const isTablet = this.settings["isTabletView"];
      const width = window.innerWidth;
      const state = {
        next: {
          mobile: width < 768,
          tablet: width < 992,
          desktop: !(width < 768) && !(width < 992)
        },
        prev: {
          mobile: isMobile,
          tablet: isTablet,
          desktop: !isMobile && !isTablet
        }
      };
      // desktop
      if (
        state.next.desktop &&
        (state.next.desktop !== state.prev.desktop || firstLoad)
      ) {
        this.setViewPort(false, false);
      }
      // tablet & collapse menu
      if (
        state.next.tablet &&
        !state.next.mobile &&
        (state.next.tablet !== state.prev.tablet || firstLoad)
      ) {
        this.setViewPort(false, true);
        this.$store.commit("settings/CHANGE_SETTING", {
          setting: "isMenuCollapsed",
          value: true
        });
      }
      // mobile
      if (
        state.next.mobile &&
        (state.next.mobile !== state.prev.mobile || firstLoad)
      ) {
        this.setViewPort(true, false);
      }
    }
  }
};
</script>

<style>
.air__utils__content {
  max-width: 100rem !important;
}
.ant-layout-content {
  background-color: #f5f5f585;
}
.air__utils__heading {
  margin-bottom: 1.66rem;
}
th.column-action,
td.column-action {
  text-align: right !important;
  padding-right: 18px !important;
}

html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.ql-editor {
  min-height: 300px;
}
</style>

