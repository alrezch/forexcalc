'use client'

import { useAPIStatus, useRefreshAPIStatus } from '@/lib/api/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function APIStatus() {
  const { data: apiStatuses, isLoading, isError, refetch } = useAPIStatus()
  const refreshMutation = useRefreshAPIStatus()

  const handleRefresh = () => {
    refreshMutation.mutate()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'limited':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'disabled':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'limited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'disabled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            API Status
          </CardTitle>
          <CardDescription>Checking API connections...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isError || !apiStatuses) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            API Status
          </CardTitle>
          <CardDescription>Failed to load API status</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const activeApis = Object.entries(apiStatuses).filter(([_, status]) => status.status === 'active')
  const limitedApis = Object.entries(apiStatuses).filter(([_, status]) => status.status === 'limited')
  const errorApis = Object.entries(apiStatuses).filter(([_, status]) => status.status === 'error')
  const disabledApis = Object.entries(apiStatuses).filter(([_, status]) => status.status === 'disabled')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              API Status
            </CardTitle>
            <CardDescription>
              Real-time forex data sources and their current status
            </CardDescription>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={refreshMutation.isPending}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshMutation.isPending && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{activeApis.length}</div>
              <div className="text-sm text-green-600">Active</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border">
              <div className="text-2xl font-bold text-yellow-600">{limitedApis.length}</div>
              <div className="text-sm text-yellow-600">Limited</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{errorApis.length}</div>
              <div className="text-sm text-red-600">Error</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border">
              <div className="text-2xl font-bold text-gray-600">{disabledApis.length}</div>
              <div className="text-sm text-gray-600">Disabled</div>
            </div>
          </div>

          {/* API Details */}
          <div className="space-y-3">
            {Object.entries(apiStatuses).map(([apiName, status]) => (
              <div key={apiName} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status.status)}
                  <div>
                    <div className="font-medium">{apiName.replace('_', ' ')}</div>
                    <div className="text-sm text-muted-foreground">{status.message}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(status.status)}>
                    {status.status}
                  </Badge>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Limit: {status.freeTierLimit}</div>
                    <div>Remaining: {status.remainingCalls}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
