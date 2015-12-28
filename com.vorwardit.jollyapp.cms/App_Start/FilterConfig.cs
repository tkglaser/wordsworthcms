using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.jollyapp.cms
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
