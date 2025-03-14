import { Injectable } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { QuarterResult } from '../../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private analytics: AngularFireAnalytics) {}

  logEvent(eventName: string, params?: { [key: string]: any }): Promise<void> {
    return this.analytics.logEvent(eventName, params);
  }

  logGameStart(quarterId: string, isAuthenticated: boolean): Promise<void> {
    return this.logEvent('game_start', {
      quarter_id: quarterId,
      is_authenticated: isAuthenticated,
      timestamp: new Date().toISOString()
    });
  }

  logGameComplete(result: QuarterResult): Promise<void> {
    return this.logEvent('game_complete', {
      quarter_id: result.quarterId,
      user_id: result.userId || 'anonymous',
      score: result.totalScore,
      max_score: result.maxScore,
      score_percentage: (result.totalScore! / result.maxScore!) * 100,
      completion_time: result.completedAt,
      favorite_sample: result.favoriteId,
      least_favorite_sample: result.leastFavoriteId
    });
  }

  logShareResult(resultId: string, platform: string): Promise<void> {
    return this.logEvent('share_result', {
      result_id: resultId,
      platform,
      timestamp: new Date().toISOString()
    });
  }

  logAdminAction(action: string, details?: { [key: string]: any }): Promise<void> {
    return this.logEvent('admin_action', {
      action,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  logError(errorType: string, errorMessage: string, context?: { [key: string]: any }): Promise<void> {
    return this.logEvent('app_error', {
      error_type: errorType,
      error_message: errorMessage,
      ...context,
      timestamp: new Date().toISOString()
    });
  }

  setUserProperties(properties: { [key: string]: any }): Promise<void> {
    const promises = Object.entries(properties).map(([key, value]) => 
      this.analytics.setUserProperties({ [key]: value })
    );
    
    return Promise.all(promises).then(() => {});
  }
}