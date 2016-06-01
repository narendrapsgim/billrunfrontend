import RatesView from './ratesView';
import VatsView from './vatsView';
import DiscountsView from './discountsView';
import ProductsView from './productsView';
import LinesView from './linesView';
import ChargesView from './chargesView';
import PlansView from './plansView';
import ImportExportHtml from './importExportView';
import PlanSetupView from './planSetupView';
import DashboardViewHtml from './dashboardView';


const View = {
  pages: {
    dashboard: {
      permission : ["guest","read"],
      menu_title: "Dashboard",
      view_type: "html",
      html : DashboardViewHtml
    },
    rates: {
      permission : ["read"],
      menu_title: "Rates",
      route: "rates/rates/list",
      views: {
        list: RatesView.rates_list_view,
        new: RatesView.rates_new_view,
        clone: RatesView.rates_clone_view,
        close_and_new: RatesView.rates_close_and_new_view,
        edit: RatesView.rates_edit_view
      }
    },
    rates_vat: {
      permission : ["read"],
      menu_title: "VAT",
      route: "rates_vat/rates/list",
      views: {
        list: VatsView.rates_vat_list_view,
        edit: VatsView.rates_vat_edit_view
      }
    },
    rates_product: {
      permission : ["read"],
      menu_title: "Products",
      route: "rates_product/rates/list",
      views: {
        list: ProductsView.rates_product_list_view,
        edit: ProductsView.rates_product_edit_view
      }
    },
    rates_discount: {
      permission : ["read"],
      menu_title: "Discounts",
      route: "rates_discount/rates/list",
      views: {
        list: DiscountsView.rates_discount_list_view,
        edit: DiscountsView.rates_discount_edit_view
      }
    },
    rates_charge: {
      permission : ["read"],
      menu_title: "Charges",
      route: "rates_charge/rates/list",
      views: {
        list: ChargesView.rates_charge_list_view,
        edit: ChargesView.rates_charge_edit_view
      }
    },

    plans: {
      permission : ["read"],
      menu_title: "Plans",
      route: "plans/plans/list",
      views: {
        list: PlansView.plans_list_view,
        new: PlansView.plans_new_view,
        clone: PlansView.plans_clone_view,
        close_and_new: PlansView.plans_close_and_new_view,
        edit: PlansView.plans_edit_view
      }
    },
    lines: {
      permission : ["read"],
      menu_title: "Lines",
      route: "lines/lines/list",
      views: {
        list: LinesView.lines_list_view,
      }
    },
    import_export_html: {
      permission: ["admin"],
      menu_title: "Import/Export",
      view_type: "html",
      html : ImportExportHtml
    },
    // plan_setup: {
    //   permission : ["guest","read"],
    //   title: "Plan Setup",
    //   menu_title: "Plan Setup",
    //   view_type: "tabs",
    //   tabs: PlanSetupView
    // }
  }
};

export default View;
