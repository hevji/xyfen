import { useState, useCallback, useRef } from 'react';
import { DownloadStatus } from '@/components/DownloadProgress';

interface DownloadState {
  id: string;
  status: DownloadStatus;
  progress: number;
  quality: string;
  downloadUrl?: string;
  error?: string;
  filename?: string;
}

interface UseDownloadOptions {
  apiUrl: string;
}

/**
 * Custom hook for managing video downloads with progress tracking
 * Uses Server-Sent Events (SSE) for real-time progress updates
 */
export const useDownload = ({ apiUrl }: UseDownloadOptions) => {
  const [downloads, setDownloads] = useState<Map<string, DownloadState>>(new Map());
  const eventSourcesRef = useRef<Map<string, EventSource>>(new Map());

  const updateDownload = useCallback((id: string, updates: Partial<DownloadState>) => {
    setDownloads(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, ...updates });
      }
      return newMap;
    });
  }, []);

  const startDownload = useCallback(async (url: string, quality: string, includeTitle: boolean = true) => {
    const downloadId = `${Date.now()}-${quality}`;
    
    // Initialize download state
    const initialState: DownloadState = {
      id: downloadId,
      status: 'downloading',
      progress: 0,
      quality,
    };
    
    setDownloads(prev => {
      const newMap = new Map(prev);
      newMap.set(downloadId, initialState);
      return newMap;
    });

    try {
      // Start SSE connection for progress updates
      const eventSource = new EventSource(
        `${apiUrl}/api/download/stream?url=${encodeURIComponent(url)}&quality=${encodeURIComponent(quality)}&id=${downloadId}&includeTitle=${includeTitle}`
      );
      
      eventSourcesRef.current.set(downloadId, eventSource);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'progress') {
            updateDownload(downloadId, {
              progress: data.progress,
              status: data.stage === 'converting' ? 'converting' : 'downloading',
            });
          } else if (data.type === 'complete') {
            updateDownload(downloadId, {
              status: 'ready',
              progress: 100,
              downloadUrl: `${apiUrl}/api/download/file/${data.filename}`,
              filename: data.filename,
            });
            eventSource.close();
            eventSourcesRef.current.delete(downloadId);
          } else if (data.type === 'error') {
            updateDownload(downloadId, {
              status: 'error',
              error: data.message,
            });
            eventSource.close();
            eventSourcesRef.current.delete(downloadId);
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      };

      eventSource.onerror = () => {
        // SSE might not be supported, fall back to polling
        eventSource.close();
        eventSourcesRef.current.delete(downloadId);
        
        // Start polling fallback
        pollDownloadProgress(downloadId, url, quality);
      };

    } catch (error) {
      console.error('Download error:', error);
      updateDownload(downloadId, {
        status: 'error',
        error: 'Failed to start download',
      });
    }

    return downloadId;
  }, [apiUrl, updateDownload]);

  // Polling fallback for browsers that don't support SSE well
  const pollDownloadProgress = useCallback(async (downloadId: string, url: string, quality: string) => {
    try {
      // Start the download
      const startResponse = await fetch(`${apiUrl}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, quality, id: downloadId }),
      });

      if (!startResponse.ok) {
        const error = await startResponse.json();
        throw new Error(error.error || 'Download failed');
      }

      // Poll for progress
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`${apiUrl}/api/download/status/${downloadId}`);
          const status = await statusResponse.json();
          
          if (status.status === 'downloading' || status.status === 'converting') {
            updateDownload(downloadId, {
              status: status.status,
              progress: status.progress,
            });
          } else if (status.status === 'ready') {
            clearInterval(pollInterval);
            updateDownload(downloadId, {
              status: 'ready',
              progress: 100,
              downloadUrl: `${apiUrl}/api/download/file/${status.filename}`,
              filename: status.filename,
            });
          } else if (status.status === 'error') {
            clearInterval(pollInterval);
            updateDownload(downloadId, {
              status: 'error',
              error: status.error,
            });
          }
        } catch (e) {
          console.error('Polling error:', e);
        }
      }, 500);

    } catch (error) {
      updateDownload(downloadId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Download failed',
      });
    }
  }, [apiUrl, updateDownload]);

  const downloadFile = useCallback((downloadId: string) => {
    const download = downloads.get(downloadId);
    if (download?.downloadUrl) {
      // Create a temporary link and click it to trigger download
      const link = document.createElement('a');
      link.href = download.downloadUrl;
      link.download = download.filename || 'video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [downloads]);

  const retryDownload = useCallback((downloadId: string, url: string) => {
    const download = downloads.get(downloadId);
    if (download) {
      // Remove the failed download
      setDownloads(prev => {
        const newMap = new Map(prev);
        newMap.delete(downloadId);
        return newMap;
      });
      // Start a new one
      startDownload(url, download.quality);
    }
  }, [downloads, startDownload]);

  const cancelDownload = useCallback((downloadId: string) => {
    // Close any active EventSource
    const eventSource = eventSourcesRef.current.get(downloadId);
    if (eventSource) {
      eventSource.close();
      eventSourcesRef.current.delete(downloadId);
    }
    
    // Remove from state
    setDownloads(prev => {
      const newMap = new Map(prev);
      newMap.delete(downloadId);
      return newMap;
    });
  }, []);

  const getActiveDownload = useCallback((quality: string) => {
    for (const download of downloads.values()) {
      if (download.quality === quality && download.status !== 'error') {
        return download;
      }
    }
    return null;
  }, [downloads]);

  return {
    downloads,
    startDownload,
    downloadFile,
    retryDownload,
    cancelDownload,
    getActiveDownload,
  };
};
