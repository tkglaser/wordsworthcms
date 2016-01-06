using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;

namespace com.vorwardit.wordsworthcms.Engine
{
    public class DbCacheDependency : CacheDependency
    {
        private Action<DbCacheDependency> notifyDisposed;

        public DbCacheDependency(Action<DbCacheDependency> notifyDisposed)
        {
            this.notifyDisposed = notifyDisposed;
        }
        public void Invalidate()
        {
            base.NotifyDependencyChanged(this, null);
        }

        protected override void DependencyDispose()
        {
            base.DependencyDispose();
            if (notifyDisposed != null)
            {
                notifyDisposed(this);
            }
        }
    }
}