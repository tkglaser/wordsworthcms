using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(com.vorwardit.wordsworthcms.Startup))]
namespace com.vorwardit.wordsworthcms
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
